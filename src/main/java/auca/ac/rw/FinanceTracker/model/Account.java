package auca.ac.rw.FinanceTracker.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "accounts")
@NoArgsConstructor
@AllArgsConstructor
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Account {

    @Id
    @Column(name = "account_id")
    private UUID accountId = UUID.randomUUID();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "account_balance")
    private Double balance;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private List<Transaction> transactions;

}
