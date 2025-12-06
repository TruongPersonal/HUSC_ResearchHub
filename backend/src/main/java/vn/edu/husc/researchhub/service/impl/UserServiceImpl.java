package vn.edu.husc.researchhub.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.edu.husc.researchhub.dto.request.UserRequest;
import vn.edu.husc.researchhub.dto.response.UserResponse;
import vn.edu.husc.researchhub.model.Department;
import vn.edu.husc.researchhub.model.Role;
import vn.edu.husc.researchhub.model.User;
import vn.edu.husc.researchhub.repository.DepartmentRepository;
import vn.edu.husc.researchhub.repository.UserRepository;
import vn.edu.husc.researchhub.service.UserService;

@Service
@RequiredArgsConstructor
@org.springframework.transaction.annotation.Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final vn.edu.husc.researchhub.service.EmailService emailService;
    private final vn.edu.husc.researchhub.service.FileService fileService;

    @Override
    public Page<UserResponse> getAll(String keyword, Role role, Integer departmentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<User> userPage = userRepository.search(keyword, role, departmentId, pageable);
        return userPage.map(this::mapToResponse);
    }

    @Override
    public UserResponse create(UserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Mã người dùng đã tồn tại: " + request.getUsername());
        }

        if (request.getRole() == Role.ASSISTANT && request.getDepartmentId() == null) {
            throw new RuntimeException("Trợ lý khoa bắt buộc phải thuộc một khoa");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setRole(request.getRole() != null ? request.getRole() : Role.STUDENT);
        
        String rawPassword;
        if (user.getRole() == Role.ADMIN) {
            rawPassword = "Admin123@HR!";
        } else if (user.getRole() == Role.ASSISTANT) {
            rawPassword = "Assistant123@HR!";
        } else {
            rawPassword = generateRandomPassword();
        }
        
        user.setPassword(passwordEncoder.encode(rawPassword));

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + request.getDepartmentId()));
            user.setDepartment(department);
        }

        User saved = userRepository.save(user);
        
        // Send email only for STUDENT and TEACHER
        if (saved.getRole() == Role.STUDENT || saved.getRole() == Role.TEACHER) {
            String email = request.getUsername() + "@husc.edu.vn";
            emailService.sendAccountInfo(email, request.getUsername(), rawPassword);
        }

        UserResponse response = mapToResponse(saved);
        return response;
    }

    @Override
    public UserResponse update(Integer id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));

        // Prevent editing of ADMIN and ASSISTANT users
        if (user.getRole() == Role.ADMIN || user.getRole() == Role.ASSISTANT) {
            throw new RuntimeException("Không thể chỉnh sửa thông tin Quản trị viên hoặc Trợ lý khoa");
        }

        // Only check if username is changing (which shouldn't happen often but logic is here)
        if (!user.getUsername().equals(request.getUsername()) && userRepository.existsByUsername(request.getUsername())) {
             throw new RuntimeException("Mã người dùng đã tồn tại: " + request.getUsername());
        }

        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        
        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + request.getDepartmentId()));
            user.setDepartment(department);
        }
        // Remove the else block that sets department to null to prevent accidental clearing

        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    @Override
    public UserResponse getById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));
        return mapToResponse(user);
    }

    @Override
    public UserResponse resetPassword(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));
        
        // Prevent reset for ADMIN and ASSISTANT
        if (user.getRole() == Role.ADMIN || user.getRole() == Role.ASSISTANT) {
            throw new RuntimeException("Không thể reset mật khẩu cho Quản trị viên hoặc Trợ lý khoa");
        }
        
        String rawPassword = generateRandomPassword();
        user.setPassword(passwordEncoder.encode(rawPassword));

        userRepository.save(user);

        // Send email only for STUDENT and TEACHER
        if (user.getRole() == Role.STUDENT || user.getRole() == Role.TEACHER) {
            String email = user.getUsername() + "@husc.edu.vn";
            emailService.sendPasswordResetInfo(email, user.getUsername(), rawPassword);
        }

        UserResponse response = mapToResponse(user);
        return response;
    }



    @Override
    public void importUsers(org.springframework.web.multipart.MultipartFile file) {
        try (java.io.InputStream inputStream = file.getInputStream();
             org.apache.poi.ss.usermodel.Workbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook(inputStream)) {
            
            org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0);
            java.util.Iterator<org.apache.poi.ss.usermodel.Row> rows = sheet.iterator();
            
            // Skip header
            if (rows.hasNext()) {
                rows.next();
            }

            while (rows.hasNext()) {
                org.apache.poi.ss.usermodel.Row currentRow = rows.next();
                
                String username = getCellValue(currentRow.getCell(0));
                if (username == null || username.isEmpty()) continue;
                
                if (userRepository.existsByUsername(username)) {
                    continue; 
                }

                String fullName = getCellValue(currentRow.getCell(1));
                String roleStr = getCellValue(currentRow.getCell(2));
                String departmentCode = getCellValue(currentRow.getCell(3));

                User user = new User();
                user.setUsername(username);
                user.setFullName(fullName != null ? fullName : username);
                
                try {
                    user.setRole(roleStr != null ? Role.valueOf(roleStr.toUpperCase()) : Role.STUDENT);
                } catch (IllegalArgumentException e) {
                    user.setRole(Role.STUDENT);
                }
                
                String rawPassword = generateRandomPassword();
                user.setPassword(passwordEncoder.encode(rawPassword));


                if (departmentCode != null && !departmentCode.isEmpty()) {
                    Department department = null;
                    try {
                        Integer deptId = Integer.parseInt(departmentCode);
                        department = departmentRepository.findById(deptId).orElse(null);
                    } catch (NumberFormatException e) {
                        // Not an ID
                    }

                    if (department == null) {
                        department = departmentRepository.findByCode(departmentCode).orElse(null);
                    }

                    if (department == null) {
                        department = departmentRepository.findByName(departmentCode).orElse(null);
                    }

                    if (department != null) {
                        user.setDepartment(department);
                    }
                }

                userRepository.save(user);
                
                // Send email only for STUDENT and TEACHER
                if (user.getRole() == Role.STUDENT || user.getRole() == Role.TEACHER) {
                    String email = username + "@husc.edu.vn";
                    emailService.sendAccountInfo(email, username, rawPassword);
                }
            }
        } catch (java.io.IOException e) {
            throw new RuntimeException("Lỗi khi xử lý file Excel: " + e.getMessage());
        }
    }

    private String getCellValue(org.apache.poi.ss.usermodel.Cell cell) {
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                }
                return String.valueOf((int) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return null;
        }
    }

    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        StringBuilder sb = new StringBuilder();
        java.util.Random random = new java.util.Random();
        for (int i = 0; i < 10; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    @Override
    public void changePassword(String username, String oldPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + username));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không chính xác");
        }

        if (user.getRole() == Role.ADMIN || user.getRole() == Role.ASSISTANT) {
            throw new RuntimeException("Quản trị viên và Trợ lý khoa không được phép thay đổi mật khẩu");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public UserResponse updateProfile(String username, vn.edu.husc.researchhub.dto.request.UpdateProfileRequest request, org.springframework.web.multipart.MultipartFile avatar) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + username));
        
        if (request.getFullName() != null) user.setFullName(request.getFullName().isEmpty() ? null : request.getFullName());
        if (request.getEmail() != null) user.setEmail(request.getEmail().isEmpty() ? null : request.getEmail());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber().isEmpty() ? null : request.getPhoneNumber());
        if (request.getSex() != null) user.setSex(request.getSex());
        
        if (request.getBornDate() != null) {
            if (request.getBornDate().isEmpty()) {
                user.setBornDate(null);
            } else {
                try {
                    user.setBornDate(java.time.LocalDate.parse(request.getBornDate()));
                } catch (Exception e) {
                    // Ignore invalid date format or handle error
                }
            }
        }
        
        if (request.getCourse() != null) user.setCourse(request.getCourse());
        if (request.getClassName() != null) user.setClassName(request.getClassName().isEmpty() ? null : request.getClassName());
        if (request.getAcademicDegree() != null) user.setAcademicDegree(request.getAcademicDegree().isEmpty() ? null : request.getAcademicDegree());
        
        if (Boolean.TRUE.equals(request.getDeleteAvatar())) {
            user.setAvatarUrl(null);
        } else if (avatar != null && !avatar.isEmpty()) {
            String fileName = fileService.storeFile(avatar, "avatars");
            String fileUrl = "/uploads/avatars/" + fileName;
            user.setAvatarUrl(fileUrl);
        }
        
        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    @Override
    public String updateAvatar(String username, org.springframework.web.multipart.MultipartFile file) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + username));
        
        String fileName = fileService.storeFile(file, "avatars");
        
        // Assuming we serve files from /uploads/avatars/
        String fileUrl = "/uploads/avatars/" + fileName;
        
        user.setAvatarUrl(fileUrl);
        userRepository.save(user);
        
        return fileUrl;
    }

    @Override
    public UserResponse getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + username));
        return mapToResponse(user);
    }

    @Override
    public java.util.List<UserResponse> getEligibleSupervisors(Integer departmentId) {
        java.util.List<User> users = userRepository.findEligibleSupervisors(departmentId);
        return users.stream().map(this::mapToResponse).collect(java.util.stream.Collectors.toList());
    }

    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole());
        response.setDepartmentName(user.getDepartment() != null ? user.getDepartment().getName() : null);
        response.setDepartmentId(user.getDepartment() != null ? user.getDepartment().getId() : null);
        
        // Extended fields
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setSex(user.getSex());
        response.setBornDate(user.getBornDate() != null ? user.getBornDate().toString() : null);
        response.setAvatarUrl(user.getAvatarUrl());
        response.setCourse(user.getCourse());
        response.setClassName(user.getClassName());
        response.setAcademicDegree(user.getAcademicDegree());

        return response;
    }
}
