package auca.ac.rw.FinanceTracker.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import auca.ac.rw.FinanceTracker.model.Budget;
import auca.ac.rw.FinanceTracker.model.Category;
import auca.ac.rw.FinanceTracker.model.User;

@Repository
public interface IBudgetRepository extends JpaRepository<Budget, UUID>{

    List<Budget> findByUserUserId(UUID userId);
    
    Optional<Budget> findByUserAndCategory(User user, Category category);
}
