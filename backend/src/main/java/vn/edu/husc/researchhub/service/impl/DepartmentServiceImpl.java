package vn.edu.husc.researchhub.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import vn.edu.husc.researchhub.dto.request.DepartmentRequest;
import vn.edu.husc.researchhub.dto.response.DepartmentResponse;
import vn.edu.husc.researchhub.model.Department;
import vn.edu.husc.researchhub.repository.DepartmentRepository;
import vn.edu.husc.researchhub.service.DepartmentService;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

  private final DepartmentRepository departmentRepository;
  private final vn.edu.husc.researchhub.repository.UserRepository userRepository;

  @Override
  public Page<DepartmentResponse> getAll(String keyword, int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
    Page<Department> departmentPage = departmentRepository.search(keyword, pageable);
    return departmentPage.map(this::mapToResponse);
  }

  @Override
  public DepartmentResponse create(DepartmentRequest request) {
    if (departmentRepository.existsByCode(request.getCode())) {
      throw new RuntimeException("Mã khoa đã tồn tại: " + request.getCode());
    }
    Department department = new Department();
    department.setCode(request.getCode());
    department.setName(request.getName());
    Department saved = departmentRepository.save(department);
    return mapToResponse(saved);
  }

  @Override
  public DepartmentResponse update(Integer id, DepartmentRequest request) {
    Department department =
        departmentRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + id));

    if (departmentRepository.existsByCodeAndIdNot(request.getCode(), id)) {
      throw new RuntimeException("Mã khoa đã tồn tại: " + request.getCode());
    }

    department.setCode(request.getCode());
    department.setName(request.getName());
    Department saved = departmentRepository.save(department);
    return mapToResponse(saved);
  }

  @Override
  public DepartmentResponse getById(Integer id) {
    Department department =
        departmentRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + id));
    return mapToResponse(department);
  }

  private DepartmentResponse mapToResponse(Department department) {
    DepartmentResponse response = new DepartmentResponse();
    response.setId(department.getId());
    response.setCode(department.getCode());
    response.setName(department.getName());
    response.setUserCount(userRepository.countByDepartmentId(department.getId()));
    return response;
  }
}
