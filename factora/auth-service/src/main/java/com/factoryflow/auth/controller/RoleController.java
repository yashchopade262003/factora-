package com.factoryflow.auth.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.factoryflow.auth.InterfaceService.IRoleService;
import com.factoryflow.auth.dto.RoleDTO;

@RestController
@RequestMapping("/role")
public class RoleController {

    @Autowired
    private IRoleService roleService;

    @PostMapping("/add")
    public ResponseEntity<RoleDTO> addRole(
            @RequestBody RoleDTO dto){

        return ResponseEntity.ok(
                roleService.addRole(dto));
    }

    @GetMapping("/list")
    public ResponseEntity<List<RoleDTO>>
    getAllRoles(){

        return ResponseEntity.ok(
                roleService.getAllRoles());
    }
}