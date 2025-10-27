package com.bookland.BookLand.Controller;

import com.bookland.BookLand.DTO.CartDTOs.AddToCartDTO;
import com.bookland.BookLand.DTO.CartDTOs.CartDTO;
import com.bookland.BookLand.DTO.CartDTOs.DeleteFromCartDTO;
import com.bookland.BookLand.Service.CartService;
import jakarta.transaction.Transactional;
import java.beans.Transient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

  private final CartService cartService;

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

  /**
   * Remove 1 item from quantity from cartItem
   * Uses for remove 1 book of 2 of the same type
   */
  @PostMapping("/removeItem")
  public ResponseEntity<CartDTO> removeItem(Authentication authentication, @RequestBody DeleteFromCartDTO deleteDTO) {
    CartDTO cart = cartService.removeItemFromCart(authentication.getName(), deleteDTO);
    return ResponseEntity.ok(cart);
  }

  /**
   * Remove book from cart
   * Uses for delete book from cart and not watch on quantity
   */
  @DeleteMapping("/deleteItem")
  @Transactional
  public ResponseEntity<Void> deleteItem(Authentication authentication, @RequestBody DeleteFromCartDTO deleteDTO) {
    cartService.deleteItemFromCart(authentication.getName(), deleteDTO);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/deleteCart/{id}")
  public ResponseEntity<Void> deleteCart(@PathVariable Long id) {
    cartService.deleteCart(id);
    return ResponseEntity.ok().build();
  }
}
