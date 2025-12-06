package vn.edu.husc.researchhub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.husc.researchhub.model.enums.YearSessionStatus;

@Entity
@Table(name = "year_session")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class YearSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(nullable = false)
    private Integer year;

    @Enumerated(EnumType.STRING)
    private YearSessionStatus status;
}
