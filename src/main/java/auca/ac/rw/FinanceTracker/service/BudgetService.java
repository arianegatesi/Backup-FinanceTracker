package auca.ac.rw.FinanceTracker.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import auca.ac.rw.FinanceTracker.model.Budget;
import auca.ac.rw.FinanceTracker.model.User;
import auca.ac.rw.FinanceTracker.repository.IBudgetRepository;
import auca.ac.rw.FinanceTracker.repository.IUserRepository;

@Service
public class BudgetService {

    @Autowired
    private IBudgetRepository budgetRepository;

    @Autowired
    private IUserRepository userRepository;

    public String saveBudget(Budget budget) {
        Optional<User> existingUser = userRepository.findByUserNameAndUserEmail(budget.getUser().getUserName(), budget.getUser().getUserEmail());
        if (existingUser.isPresent()) {
            return "Budget for this category already exists";
        } else {
            budgetRepository.save(budget);
            return "Budget saved successfully";
        }
    }

    public Optional<Budget> getBudgetById(UUID budgetId) {
        return budgetRepository.findById(budgetId);
    }

    public List<Budget> getBudgetsByUser(UUID userId) {
        return budgetRepository.findByUserUserId(userId);
    }

    public String deleteBudget(UUID budgetId) {
        Optional<Budget> budget = budgetRepository.findById(budgetId);
        if (budget.isPresent()) {
            budgetRepository.deleteById(budgetId);
            return "Budget deleted successfully";
        } else {
            return "Budget not found";
        }
    }
}
