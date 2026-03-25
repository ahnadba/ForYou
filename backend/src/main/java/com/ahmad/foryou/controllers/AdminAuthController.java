package com.ahmad.foryou.controllers;

import com.ahmad.foryou.services.AdminAuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    public AdminAuthController(AdminAuthService adminAuthService) {
        this.adminAuthService = adminAuthService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> payload, HttpSession session) {
        String password = payload.get("password");
        boolean ok = adminAuthService.login(password, session);

        if (!ok) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("authenticated", false, "message", "Invalid password"));
        }

        return ResponseEntity.ok(Map.of("authenticated", true));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpSession session) {
        adminAuthService.logout(session);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> check(HttpSession session) {
        return ResponseEntity.ok(Map.of("authenticated", adminAuthService.isLoggedIn(session)));
    }
}


