package org.inventry.service.dto;

import lombok.Data;

@Data
public class VendorDTO {

    private Long vendorId;

    private String vendorCode;

    private String vendorName;

    private String ownerName;

    private String email;

    private String phone;

    private String status;

}