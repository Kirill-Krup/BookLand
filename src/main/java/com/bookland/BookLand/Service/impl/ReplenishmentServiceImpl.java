package com.bookland.BookLand.Service.impl;

import com.bookland.BookLand.DTO.ReplenishmentDTOs.ReplenishmentCreateDTO;
import com.bookland.BookLand.DTO.ReplenishmentDTOs.ReplenishmentDTO;
import com.bookland.BookLand.Mapper.ReplenishmentMapper;
import com.bookland.BookLand.Model.Replenishment;
import com.bookland.BookLand.Model.User;
import com.bookland.BookLand.Repository.ReplenishmentRepository;
import com.bookland.BookLand.Repository.UserRepository;
import com.bookland.BookLand.Service.ReplenishmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReplenishmentServiceImpl implements ReplenishmentService {

  private final ReplenishmentRepository replenishmentRepository;
  private final ReplenishmentMapper replenishmentMapper;
  private final UserRepository userRepository;

  @Override
  @Transactional
  public ReplenishmentDTO createReplenishment(String name,
      ReplenishmentCreateDTO replenishmentCreateDTO) {
    Replenishment replenishment = new Replenishment();
    User user = userRepository.findUserByLogin(name);
    replenishment.setUser(user);
    replenishment.setAmount(replenishmentCreateDTO.getAmount());
    replenishment.setPaymentMethod(replenishmentCreateDTO.getPaymentMethod());
    user.setWallet(replenishment.getAmount() + user.getWallet());
    userRepository.save(user);
    return replenishmentMapper.toDto(replenishmentRepository.save(replenishment));
  }
}
