package com.ahmad.foryou.services;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@Service
public class AdminAuthService {

    public static final String ADMIN_SESSION_KEY = "ADMIN_LOGGED_IN";

    private final String adminPassword;

    public AdminAuthService(@Value("${app.admin.password}") String adminPassword) {
        this.adminPassword = adminPassword;
    }

    public boolean login(String password, HttpSession session) {
        boolean matches = MessageDigest.isEqual(
                adminPassword.getBytes(StandardCharsets.UTF_8),
                (password == null ? "" : password).getBytes(StandardCharsets.UTF_8)
        );

        if (matches) {
            session.setAttribute(ADMIN_SESSION_KEY, true);
            return true;
        }

        session.removeAttribute(ADMIN_SESSION_KEY);
        return false;
    }

    public void logout(HttpSession session) {
        session.removeAttribute(ADMIN_SESSION_KEY);
    }

    public boolean isLoggedIn(HttpSession session) {
        Object value = session.getAttribute(ADMIN_SESSION_KEY);
        return value instanceof Boolean loggedIn && loggedIn;
    }
}

