package auca.ac.rw.FinanceTracker.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import auca.ac.rw.FinanceTracker.model.Account;
import auca.ac.rw.FinanceTracker.model.User;
import auca.ac.rw.FinanceTracker.repository.IAccountRepository;
import auca.ac.rw.FinanceTracker.repository.IUserRepository;

@Service
public class AccountService {

    @Autowired
    private IAccountRepository accountRepository;

    @Autowired
    private IUserRepository userRepository;

    public String saveAccount(Account account) {
        System.out.println("Attempting to find user with ID: " + account.getUser().getUserId());
        Optional<User> userOptional = userRepository.findById(account.getUser().getUserId());
        System.out.println("User found: " + userOptional.isPresent());
        
        if (userOptional.isPresent()) {
            account.setUser(userOptional.get());
            accountRepository.save(account);
            return "Account created successfully";
        }
        return "User not found";
    }
    

    public Optional<Account> getAccountById(UUID accountId) {
        return accountRepository.findById(accountId);
    }

    public List<Account> getAccountsByUser(UUID userId) {
        return accountRepository.findByUserUserId(userId);
    }

    public String deleteAccount(UUID accountId) {
        Optional<Account> account = accountRepository.findById(accountId);
        if (account.isPresent()) {
            accountRepository.deleteById(accountId);
            return "Account deleted successfully";
        } else {
            return "Account not found";
        }
    }
}

