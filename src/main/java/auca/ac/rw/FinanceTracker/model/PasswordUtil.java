package auca.ac.rw.FinanceTracker.model;

import java.util.Base64;

public class PasswordUtil {
    public static String encodePassword(String password) {
        return Base64.getEncoder().encodeToString(password.getBytes());
    }

    public static String decodePassword(String encodedPassword) {
        try {
            return new String(Base64.getDecoder().decode(encodedPassword));
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}

