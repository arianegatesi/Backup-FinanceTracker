package auca.ac.rw.FinanceTracker.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import auca.ac.rw.FinanceTracker.model.Budget;
import auca.ac.rw.FinanceTracker.service.BudgetService;

@RestController
@RequestMapping(value = "/budget")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @PostMapping(value = "/saveBudget", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveBudget(@RequestBody Budget budget) {
        String response = budgetService.saveBudget(budget);
        if (response.equalsIgnoreCase("Budget for this category already exists")) {
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        } else {
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }
    }

    @GetMapping(value = "/getBudgetById/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getBudgetById(@PathVariable UUID id) {
        Optional<Budget> budget = budgetService.getBudgetById(id);
        if (budget.isPresent()) {
            return new ResponseEntity<>(budget.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Budget not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "/getBudgetsByUser/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getBudgetsByUser(@PathVariable UUID userId) {
        List<Budget> budgets = budgetService.getBudgetsByUser(userId);
        if (budgets.isEmpty()) {
            return new ResponseEntity<>("No budgets found for the given user", HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(budgets, HttpStatus.OK);
        }
    }

    @DeleteMapping(value = "/deleteBudget/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable UUID id) {
        String response = budgetService.deleteBudget(id);
        if (response.equalsIgnoreCase("Budget deleted successfully")) {
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
}
