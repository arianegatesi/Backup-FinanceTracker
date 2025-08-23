package auca.ac.rw.FinanceTracker.repository;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import auca.ac.rw.FinanceTracker.model.User;

@Repository
public interface IUserRepository extends JpaRepository<User, UUID>{

    Optional<User> findByUserNameAndUserEmail(String name, String email);
    Optional<User> findByUserName(String userName);
    Optional<User> findByUserEmail( String email);
     @Query("SELECT u FROM User u WHERE u.userName LIKE %:searchTerm% OR u.userEmail LIKE %:searchTerm%")
    List<User> searchUsers(@Param("searchTerm") String searchTerm);

}
