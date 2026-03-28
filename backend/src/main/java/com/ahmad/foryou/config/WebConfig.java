package com.ahmad.foryou.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final AdminSessionInterceptor adminSessionInterceptor;

    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;

    public WebConfig(AdminSessionInterceptor adminSessionInterceptor) {
        this.adminSessionInterceptor = adminSessionInterceptor;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(adminSessionInterceptor)
                .addPathPatterns("/api/admin/**")
                .excludePathPatterns("/api/admin/login", "/api/admin/check");
    }
}