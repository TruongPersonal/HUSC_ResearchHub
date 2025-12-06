package vn.edu.husc.researchhub.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.husc.researchhub.dto.request.UserRequest;
import vn.edu.husc.researchhub.dto.response.UserResponse;
import vn.edu.husc.researchhub.model.Role;
import vn.edu.husc.researchhub.service.UserService;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(userService.getAll(keyword, role, departmentId, page, size));
    }

    @GetMapping("/eligible-supervisors")
    public ResponseEntity<java.util.List<UserResponse>> getEligibleSupervisors(
            @RequestParam Integer departmentId,
            @RequestParam(required = false) Integer academicYearId) {
        return ResponseEntity.ok(userService.getEligibleSupervisors(departmentId));
    }

    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Integer id, @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.update(id, request));
    }

    @PutMapping("/{id}/reset-password")
    public ResponseEntity<UserResponse> resetPassword(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.resetPassword(id));
    }

    @PostMapping(value = "/import", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> importUsers(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        userService.importUsers(file);
        return ResponseEntity.ok("Import successful");
    }
}
