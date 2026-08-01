package org.buyer.service.service;

import java.util.List;
import java.util.stream.Collectors;

import org.buyer.service.ResponceEntity.ResponseStructure;
import org.buyer.service.client.VendorClient;
import org.buyer.service.dto.BuyerDTO;
import org.buyer.service.entity.Buyer;
import org.buyer.service.exception.BuyerException;
import org.buyer.service.repository.BuyerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class BuyerService {

	@Autowired
	private BuyerRepository repository;

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private VendorClient vendorClient;

	public ResponseEntity<ResponseStructure<BuyerDTO>> createBuyer(BuyerDTO dto) {
		vendorClient.getVendor(dto.getVendorId());

		Buyer buyer = modelMapper.map(dto, Buyer.class);
		buyer.setBuyerId(null);
		buyer = repository.save(buyer);

		return build(HttpStatus.CREATED, "Buyer Created Successfully", toDTO(buyer));
	}

	public ResponseEntity<ResponseStructure<List<BuyerDTO>>> getAllBuyers() {
		List<BuyerDTO> buyers = repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
		return build(HttpStatus.OK, "Buyers Fetched Successfully", buyers);
	}

	public ResponseEntity<ResponseStructure<BuyerDTO>> getBuyerById(Long id) {
		return build(HttpStatus.OK, "Buyer Fetched Successfully", toDTO(findOrThrow(id)));
	}

	public ResponseEntity<ResponseStructure<List<BuyerDTO>>> getBuyersByVendor(Long vendorId) {
		List<BuyerDTO> buyers = repository.findByVendorId(vendorId).stream().map(this::toDTO)
				.collect(Collectors.toList());
		return build(HttpStatus.OK, "Buyers Fetched Successfully", buyers);
	}

	public ResponseEntity<ResponseStructure<BuyerDTO>> updateBuyer(Long id, BuyerDTO dto) {
		Buyer buyer = findOrThrow(id);
		modelMapper.map(dto, buyer);
		buyer.setBuyerId(id);
		buyer = repository.save(buyer);
		return build(HttpStatus.OK, "Buyer Updated Successfully", toDTO(buyer));
	}

	public ResponseEntity<ResponseStructure<String>> deleteBuyer(Long id) {
		findOrThrow(id);
		repository.deleteById(id);
		return build(HttpStatus.OK, "Buyer Deleted Successfully", "Deleted id: " + id);
	}

	private Buyer findOrThrow(Long id) {
		return repository.findById(id).orElseThrow(() -> new BuyerException("Buyer Not Found with id: " + id));
	}

	private BuyerDTO toDTO(Buyer buyer) {
		return modelMapper.map(buyer, BuyerDTO.class);
	}

	private <T> ResponseEntity<ResponseStructure<T>> build(HttpStatus status, String message, T data) {
		ResponseStructure<T> response = new ResponseStructure<>();
		response.setStatusCode(status.value());
		response.setMessage(message);
		response.setData(data);
		return new ResponseEntity<>(response, status);
	}
}
