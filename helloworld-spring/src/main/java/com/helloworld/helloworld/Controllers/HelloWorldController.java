package com.helloworld.helloworld.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class HelloWorldController {

    @GetMapping(value = "/hello")
    public ResponseEntity<String> HelloWorld() {
        return new ResponseEntity<>("Hello World", HttpStatus.OK);
    }


}

