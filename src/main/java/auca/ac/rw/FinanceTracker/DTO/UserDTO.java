package auca.ac.rw.FinanceTracker.DTO;

import java.util.UUID;

import auca.ac.rw.FinanceTracker.model.AccountType;
import auca.ac.rw.FinanceTracker.model.RoleType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private UUID userId;
    private String firstName;
    private String lastName;
    private String userName;
    private String userEmail;
    private AccountType accountType;
    private RoleType role;
    private boolean enabled;
}

