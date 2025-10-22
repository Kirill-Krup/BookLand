package com.bookland.BookLand.Service.impl;

import com.bookland.BookLand.DTO.CartDTOs.AddToCartDTO;
import com.bookland.BookLand.DTO.CartDTOs.CartDTO;
import com.bookland.BookLand.Mapper.CartMapper;
import com.bookland.BookLand.Model.Book;
import com.bookland.BookLand.Model.Cart;
import com.bookland.BookLand.Model.CartItem;
import com.bookland.BookLand.Model.User;
import com.bookland.BookLand.Repository.BookRepository;
import com.bookland.BookLand.Repository.CartItemRepository;
import com.bookland.BookLand.Repository.CartRepository;
import com.bookland.BookLand.Repository.UserRepository;
import com.bookland.BookLand.Service.CartService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

  private final CartRepository cartRepository;
  private final CartMapper cartMapper;
  private final CartItemRepository cartItemRepository;
  private final BookRepository bookRepository;
  private final UserRepository userRepository;

  @Override
  public CartDTO getUserCart(String name) {
    Optional<Cart> cart = cartRepository.findByLogin(name);
    return cartMapper.toDto(cart);
  }

  @Override
  @Transactional
  public CartDTO addItemToCart(String username, AddToCartDTO addDTO) {
    Cart cart = cartRepository.findByLogin(username)
        .orElseGet(() -> createCartForUser(username));
    Book book = bookRepository.findById(addDTO.getBookId())
        .orElseThrow(() -> new RuntimeException("Книга не найдена с ID: " + addDTO.getBookId()));

    Optional<CartItem> existingItem = cart.getCartItems().stream()
        .filter(item -> item.getBook().getId().equals(addDTO.getBookId()))
        .findFirst();
    CartItem cartItem;
    if (existingItem.isPresent()) {
      cartItem = existingItem.get();
      cartItem.setQuantity(cartItem.getQuantity() + addDTO.getQuantity());
    } else {
      cartItem = CartItem.builder()
          .cart(cart)
          .book(book)
          .quantity(addDTO.getQuantity())
          .build();
      cart.getCartItems().add(cartItem);
    }
    cartItemRepository.save(cartItem);
    cart.setUpdatedAt(LocalDateTime.now());
    cartRepository.save(cart);

    return cartMapper.toDto(cart);
  }

  private Cart createCartForUser(String username) {
    User user = userRepository.findByLogin(username)
        .orElseThrow(() -> new RuntimeException("Пользователь не найден: " + username));
    Cart cart = Cart.builder()
        .user(user)
        .cartItems(new ArrayList<>())
        .build();
    return cartRepository.save(cart);
  }
}
