package auca.ac.rw.FinanceTracker.service;

import java.rmi.UnexpectedException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import auca.ac.rw.FinanceTracker.DTO.UserDTO;
import auca.ac.rw.FinanceTracker.model.PasswordUtil;
import auca.ac.rw.FinanceTracker.model.User;
import auca.ac.rw.FinanceTracker.repository.IUserRepository;
@Service
public class UserService {
    @Autowired
    private IUserRepository userRepository;

    public UserDTO convertToDTO(User user) {
        return new UserDTO(
            user.getUserId(),
            user.getFirstName(),
            user.getLastName(),
            user.getUserName(),
            user.getUserEmail(),
            user.getAccountType(),
            user.getRole(),
            user.isEnabled()
        );
    }

    public UserDTO authenticateUser(String identifier, String password) throws UnexpectedException {
        Optional<User> userOptional = findByUsernameOrEmail(identifier);
        
        if (userOptional.isPresent() && verifyPassword(password, userOptional.get().getPassword())) {
            return convertToDTO(userOptional.get());
        }
        throw new UnexpectedException("Invalid credentials");
    }

    public String signup(User user) {
        Optional<User> existingUser = userRepository.findByUserNameAndUserEmail(user.getUserName(), user.getUserEmail());
        if (existingUser.isPresent()) {
            return "User with this email and username already exists";
        }
        
        String encodedPassword = PasswordUtil.encodePassword(user.getPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);
        return "User registered successfully";
    }
    

    public Optional<User> findByUsernameOrEmail(String identifier) {
        Optional<User> user = userRepository.findByUserName(identifier);
        if (user.isEmpty()) {
            user = userRepository.findByUserEmail(identifier);
        }
        return user;
    }

    public String resetPassword(String email, String newPassword) {
        Optional<User> userOptional = userRepository.findByUserEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(PasswordUtil.encodePassword(newPassword));
            userRepository.save(user);
            return "Password reset successful";
        }
        return "User not found";
    }

    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        String decodedPassword = PasswordUtil.decodePassword(encodedPassword);
        return decodedPassword != null && rawPassword.equals(decodedPassword);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
   
    public Optional<User> getUserById(UUID userId) {
        return userRepository.findById(userId);
    }
    
    public String updateUser(UUID userId, User updatedUser) {
        return userRepository.findById(userId).map(user -> {
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            user.setUserEmail(updatedUser.getUserEmail());
            userRepository.save(user);
            return "User updated successfully";
        }).orElse("User not found");
    }
   
    public String deleteUser(UUID userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            userRepository.deleteById(userId);
            return "User deleted successfully";
        } else {
            return "User not found";
        }
    }
}
