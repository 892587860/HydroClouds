package com.hydro.server;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;



public class MultiThreadServer {
	
	private ServerSocket serverSocket;
	private ExecutorService executorService;
	private final int POOL_SIZE = 10;
	
	public MultiThreadServer() throws IOException {
		serverSocket = new ServerSocket(10086);
		executorService = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors()*POOL_SIZE);
	}
	
	public void service(){
		while(true){
			Socket socket;
			try {
				socket = serverSocket.accept();
				executorService.execute(new ServerThread(socket));
			} catch (IOException e) {
				e.printStackTrace();
			}
			
		}
	}

	public static void main(String[] args) throws IOException {
		new MultiThreadServer().service();
		
	}
}
