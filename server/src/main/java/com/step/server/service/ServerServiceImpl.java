package com.step.server.service;

import com.step.server.model.Server;
import com.step.server.repository.ServerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.transaction.Transactional;
import java.io.IOException;
import java.net.InetAddress;
import java.util.Collection;
import java.util.Random;

import static com.step.server.enumeration.Status.SERVER_DOWN;
import static com.step.server.enumeration.Status.SERVER_UP;

@RequiredArgsConstructor /* avoid implementing constructor and inject serverRepository into it automatically (Dependency Injection) */
@Service
@Transactional
@Slf4j /* log method*/
public class ServerServiceImpl implements ServerService {
    private final ServerRepository serverRepository;
    @Override
    public Server create(Server server) {
        log.info("Saving new Server: {}", server.getName());
        server.setImageUrl(setServerImageUrl());
        return serverRepository.save(server);
    }

    @Override
    public Server ping(String ipAddress) throws IOException {
        log.info("Pinging server IP: {}", ipAddress);
        Server server = serverRepository.findByIpAddress(ipAddress);
        InetAddress address = InetAddress.getByName(ipAddress);
        server.setStatus(address.isReachable(10000) ? SERVER_UP : SERVER_DOWN);
        serverRepository.save(server);
        return server;
    }

    public String setServerImageUrl(){
        String[] imageNames={"server1.png", "server2.png", "server3.png", "server4.png"};
        return ServletUriComponentsBuilder.fromCurrentContextPath().path("/server/image/" + imageNames[new Random().nextInt(4)]).toUriString();
    }

    @Override
    public Collection<Server> list(int limit) {
        log.info("Fetching all servers");
        /* return page 0 to limit converted in list */
        return serverRepository.findAll(PageRequest.of(0, limit)).toList();
    }

    @Override
    public Server get(Long id) {
        log.info("Fetching server by id: {}", id);
        return serverRepository.findById(id).get();
    }

    @Override
    public Server update(Server server) {
        log.info("Updating server by id: {}", server.getName());
        return serverRepository.save(server);
    }

    @Override
    public Boolean delete(Long id) {
        log.info("Deleting server by id: {}", id);
        serverRepository.deleteById(id);
        return Boolean.TRUE;
    }
}



