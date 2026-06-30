package com.factoryflow.auth.dto;

import lombok.Data;

@Data
public class UserDTO {

    private String username;
    private String email;
    private String password;
    private String phone;
    private String status;

    private Long vendorId;
    private Long roleId;
}