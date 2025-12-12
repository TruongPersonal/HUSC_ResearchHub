package vn.edu.husc.researchhub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.husc.researchhub.model.Role;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
  private Integer id;
  private String username;
  private String fullName;
  private Role role;
  private String departmentName;
  private Integer departmentId;
  private String password; // Only returned when creating or resetting password

  // Extended profile fields
  private String email;
  private String phoneNumber;
  private Boolean sex;
  private String bornDate; // ISO string
  private String avatarUrl;
  private Integer course;
  private String className;
  private String academicDegree;

  // Stored plain text password

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }

  public Role getRole() {
    return role;
  }

  public void setRole(Role role) {
    this.role = role;
  }

  public String getDepartmentName() {
    return departmentName;
  }

  public void setDepartmentName(String departmentName) {
    this.departmentName = departmentName;
  }

  public Integer getDepartmentId() {
    return departmentId;
  }

  public void setDepartmentId(Integer departmentId) {
    this.departmentId = departmentId;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public Boolean getSex() {
    return sex;
  }

  public void setSex(Boolean sex) {
    this.sex = sex;
  }

  public String getBornDate() {
    return bornDate;
  }

  public void setBornDate(String bornDate) {
    this.bornDate = bornDate;
  }

  public String getAvatarUrl() {
    return avatarUrl;
  }

  public void setAvatarUrl(String avatarUrl) {
    this.avatarUrl = avatarUrl;
  }

  public Integer getCourse() {
    return course;
  }

  public void setCourse(Integer course) {
    this.course = course;
  }

  public String getClassName() {
    return className;
  }

  public void setClassName(String className) {
    this.className = className;
  }

  public String getAcademicDegree() {
    return academicDegree;
  }

  public void setAcademicDegree(String academicDegree) {
    this.academicDegree = academicDegree;
  }
}
