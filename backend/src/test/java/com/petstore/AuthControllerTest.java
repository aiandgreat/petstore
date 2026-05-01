package com.petstore;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;

    @Test
    void signupAndLogin() throws Exception {
        var req = Map.of("email","test@example.com","password","Password1!");
        mvc.perform(post("/api/v1/auth/signup").contentType("application/json").content(mapper.writeValueAsString(req))).andExpect(status().isCreated());
        mvc.perform(post("/api/v1/auth/login").contentType("application/json").content(mapper.writeValueAsString(req))).andExpect(status().isOk());
    }
}
