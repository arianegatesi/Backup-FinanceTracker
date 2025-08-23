package auca.ac.rw.FinanceTracker.controller;

import java.rmi.UnexpectedException;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import auca.ac.rw.FinanceTracker.DTO.UserDTO;
import auca.ac.rw.FinanceTracker.model.User;
import auca.ac.rw.FinanceTracker.repository.IUserRepository;
import auca.ac.rw.FinanceTracker.service.UserService;

@RestController
@RequestMapping(value = "/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private IUserRepository userRepository;

    @PostMapping(value = "/saveUser", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveUser(@RequestBody User user) {
        System.out.println("Received User: " + user);
        String response = userService.signup(user);
    
        if (response.equalsIgnoreCase("User with this email and name already exists")) {
            return new ResponseEntity<>(Map.of("message", response), HttpStatus.CONFLICT);
        } else {
            return new ResponseEntity<>(Map.of("message", response), HttpStatus.CREATED);
        }
    }

    @PostMapping("/confirm-login")
    public ResponseEntity<?> confirmLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        try {
            UserDTO userDTO = userService.authenticateUser(email, password);
            return ResponseEntity.ok(userDTO);
        } catch (UnexpectedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid credentials"));
        }
    }

    @PostMapping("/verify-identifier")
    public ResponseEntity<?> verifyIdentifier(@RequestBody Map<String, String> request) {
        String userIdentifier = request.get("userIdentifier");
        String password = request.get("password");
        boolean isLogin = Boolean.parseBoolean(request.get("isLogin"));

        Optional<User> userOptional = userService.findByUsernameOrEmail(userIdentifier);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            
            if (isLogin) {
                if (userService.verifyPassword(password, user.getPassword())) {
                    UserDTO userDTO = userService.convertToDTO(user);
                    return ResponseEntity.ok(Map.of(
                        "email", user.getUserEmail(),
                        "user", userDTO
                    ));
                }
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
            }
            return ResponseEntity.ok(Map.of(
                "email", user.getUserEmail(),
                "userName", user.getUserName()
            ));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("message", "User not found"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");

        if (newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("New password cannot be null or empty.");
        }

        try {
            String response = userService.resetPassword(email, newPassword);
            if (response.equals("Password reset successful")) {
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password reset failed");
        }
    }
    @GetMapping("/getUserByEmail/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        Optional<User> userOptional = userRepository.findByUserEmail(email);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @GetMapping(value = "/getUserById/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getUserById(@PathVariable UUID id) {
        Optional<User> user = userService.getUserById(id);
        if (user.isPresent()) {
            return new ResponseEntity<>(user.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No user found with the given ID", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "/getAllUsers", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userService.getAllUsers();
        if (users.isEmpty()) {
            return new ResponseEntity<>("No users found", HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(users, HttpStatus.OK);
        }
    }

    @PutMapping(value = "/updateUser/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateUser(@PathVariable UUID id, @RequestBody User user) {
        String response = userService.updateUser(id, user);

        if (response.equalsIgnoreCase("User updated successfully")) {
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping(value = "/deleteUser/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        String response = userService.deleteUser(id);

        if (response.equalsIgnoreCase("User deleted successfully")) {
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
}

