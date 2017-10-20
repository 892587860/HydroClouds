package com.hydro.client;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;


public class ClientThread extends Thread{
	
	
	@Override
	public void run() {
		
		try {
			Socket socket = new Socket("127.0.0.1",10086);
			
			InputStream inputStream  = socket.getInputStream();
			
			OutputStream outputStream = socket.getOutputStream();
			
			BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, "utf-8"));
			
			PrintWriter writer = new PrintWriter(new OutputStreamWriter(outputStream,"utf-8"),true);
		
			writer.println("服务端请接收报文---");
			String strFroServer = reader.readLine();
			
			System.out.println("服务端发来："+strFroServer);
			
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}
