package com.step.server;

import com.step.server.enumeration.Status;
import com.step.server.model.Server;
import com.step.server.repository.ServerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

	//run after the app is init + to see servers in browser
	@Bean
	CommandLineRunner run(ServerRepository serverRepository){
		return args -> {
			serverRepository.save(new Server(null, "192.168.1.160", "Ubuntu Linux", "16GB", "Personal PC",
					"http://localhost:8080/server/image/server1.png", Status.SERVER_DOWN));
			serverRepository.save(new Server(null, "192.165.0.160", "Ubuntu Linux", "16GB", "Personal PC",
					"http://localhost:8080/server/image/server2.png", Status.SERVER_UP));
			serverRepository.save(new Server(null, "232.231.1.160", "Ubuntu Linux", "16GB", "Personal PC",
					"http://localhost:8080/server/image/server3.png", Status.SERVER_UP));
			serverRepository.save(new Server(null, "192.0.0.0", "Ubuntu Linux", "16GB", "Personal PC",
					"http://localhost:8080/server/image/server4.png", Status.SERVER_DOWN));
		};
	}
}
