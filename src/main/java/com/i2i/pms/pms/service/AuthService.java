package com.i2i.pms.pms.service;

import com.i2i.pms.pms.dto.LoginRequest;
import com.i2i.pms.pms.dto.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest loginRequest);
    
    boolean validateToken(String token);
    
    String getEmailFromToken(String token);
    
    Long getUserIdFromToken(String token);
} 