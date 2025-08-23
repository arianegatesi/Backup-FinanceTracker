package auca.ac.rw.FinanceTracker.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "reports")
@NoArgsConstructor
@AllArgsConstructor
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Report {

    @Id
    @Column(name = "report_id")
    private UUID reportId = UUID.randomUUID();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "total_income")
    private Double totalIncome;

    @Column(name = "total_expenses")
    private Double totalExpenses;

}
