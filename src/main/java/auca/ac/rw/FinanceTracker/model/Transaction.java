package auca.ac.rw.FinanceTracker.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "transactions")
@NoArgsConstructor
@AllArgsConstructor
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Transaction {

    @Id
    @Column(name = "transaction_id")
    private UUID transactionId = UUID.randomUUID();

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "date")
    private Date date;

    @Column(name = "description")
    private String description;
 
    @Column(name = "transaction_type")
@Enumerated(EnumType.STRING)
private TransactionType transactionType;
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

}
