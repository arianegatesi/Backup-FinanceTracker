package auca.ac.rw.FinanceTracker.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import auca.ac.rw.FinanceTracker.model.Account;

@Repository
public interface IAccountRepository extends JpaRepository<Account, UUID>{

        List<Account> findByUserUserId(UUID userId);
}
