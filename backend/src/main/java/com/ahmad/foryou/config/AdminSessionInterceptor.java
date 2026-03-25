package com.ahmad.foryou.config;

import com.ahmad.foryou.services.AdminAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;

@Component
public class AdminSessionInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        HttpSession session = request.getSession(false);
        boolean isLoggedIn = false;

        if (session != null) {
            Object value = session.getAttribute(AdminAuthService.ADMIN_SESSION_KEY);
            isLoggedIn = value instanceof Boolean loggedIn && loggedIn;
        }

        if (isLoggedIn) {
            return true;
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"message\":\"Unauthorized\"}");
        return false;
    }
}

