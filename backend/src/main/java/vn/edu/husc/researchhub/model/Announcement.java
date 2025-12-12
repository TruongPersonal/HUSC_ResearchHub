package vn.edu.husc.researchhub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "announcement")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Announcement {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false, columnDefinition = "LONGTEXT")
  private String content;

  @CreationTimestamp
  @Column(name = "publish_datetime")
  private LocalDateTime publishDatetime;

  @ManyToOne
  @JoinColumn(name = "department_id")
  private Department department;

  @ManyToOne
  @JoinColumn(name = "academic_year_id")
  private AcademicYear academicYear;
}
