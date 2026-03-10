package com.avisek.app.e_com_project.config;

import com.avisek.app.e_com_project.model.User;
import com.avisek.app.e_com_project.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepo.existsByUsername("admin")) {
            userRepo.save(User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ROLE_ADMIN")
                    .build());
            log.info("Default admin created — admin / admin123");
        }
        if (!userRepo.existsByUsername("user")) {
            userRepo.save(User.builder()
                    .username("user")
                    .password(passwordEncoder.encode("user123"))
                    .role("ROLE_USER")
                    .build());
            log.info("Default user created — user / user123");
        }
    }
}
