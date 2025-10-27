package com.bookland.BookLand.Controller;

import com.bookland.BookLand.DTO.ReplenishmentDTOs.ReplenishmentCreateDTO;
import com.bookland.BookLand.DTO.ReplenishmentDTOs.ReplenishmentDTO;
import com.bookland.BookLand.Service.ReplenishmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/replenishments")
@RequiredArgsConstructor
public class ReplenishmentController {

  private final ReplenishmentService replenishmentService;

  @PostMapping("/newReplenishment")
  public ResponseEntity<ReplenishmentDTO> createReplenishment(Authentication authUser, @RequestBody ReplenishmentCreateDTO replenishmentCreateDTO) {
    ReplenishmentDTO dto = replenishmentService.createReplenishment(authUser.getName(), replenishmentCreateDTO);
    return new ResponseEntity<>(dto, HttpStatus.CREATED);
  }

}
