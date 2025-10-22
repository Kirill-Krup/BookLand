package com.bookland.BookLand.Controller;

import com.bookland.BookLand.DTO.CartDTOs.AddToCartDTO;
import com.bookland.BookLand.DTO.CartDTOs.CartDTO;
import com.bookland.BookLand.Service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

  private final CartService cartService;

  @PostMapping()

  @GetMapping("/getUserCart")
  public ResponseEntity<CartDTO> getUserCart(Authentication authentication) {
    CartDTO cartDTO= cartService.getUserCart(authentication.getName());
    return ResponseEntity.ok(cartDTO);
  }

  @PostMapping("/addItem")
  public ResponseEntity<CartDTO> addItem(Authentication authentication, @RequestBody AddToCartDTO addDTO) {
    CartDTO cart = cartService.addItemToCart(authentication.getName(), addDTO);
    return ResponseEntity.ok(cart);
  }

}
