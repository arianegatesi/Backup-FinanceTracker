package auca.ac.rw.FinanceTracker.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import auca.ac.rw.FinanceTracker.model.Account;
import auca.ac.rw.FinanceTracker.service.AccountService;

@RestController
@RequestMapping(value = "/account")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping(value = "/saveAccount", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveAccount(@RequestBody Account account) {
        String response = accountService.saveAccount(account);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping(value = "/getAccountById/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAccountById(@PathVariable UUID id) {
        Optional<Account> account = accountService.getAccountById(id);
        if (account.isPresent()) {
            return new ResponseEntity<>(account.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Account not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "/getAccountsByUser/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAccountsByUser(@PathVariable UUID userId) {
        List<Account> accounts = accountService.getAccountsByUser(userId);
        if (accounts.isEmpty()) {
            return new ResponseEntity<>("No accounts found for the given user", HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(accounts, HttpStatus.OK);
        }
    }

    @DeleteMapping(value = "/deleteAccount/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable UUID id) {
        String response = accountService.deleteAccount(id);
        if (response.equalsIgnoreCase("Account deleted successfully")) {
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
}

