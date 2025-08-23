package auca.ac.rw.FinanceTracker.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import auca.ac.rw.FinanceTracker.model.Report;

@Repository
public interface IReportRepository extends JpaRepository<Report, UUID>{

        List<Report> findByUserUserId(UUID userId);
         @Query("SELECT r FROM Report r WHERE r.startDate = :date OR r.endDate = :date")
        List<Report> searchReports(@Param("date") LocalDate date);
}
