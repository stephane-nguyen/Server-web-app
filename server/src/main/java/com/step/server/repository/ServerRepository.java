package com.step.server.repository;

import com.step.server.model.Server;
import org.springframework.data.jpa.repository.JpaRepository;

/* manage info in the db & manipulate db */
/* Long type for id */
public interface ServerRepository extends JpaRepository<Server, Long> {
    Server findByIpAddress(String IpAddress);
}
