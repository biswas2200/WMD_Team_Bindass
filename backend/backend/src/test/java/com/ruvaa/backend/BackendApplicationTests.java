package com.ruvaa.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
class BackendApplicationTests {

    @org.springframework.boot.test.mock.mockito.MockBean
    private com.ruvaa.backend.service.MissionGeneratorService missionGeneratorService;

	@Test
	void contextLoads() {
	}

}
