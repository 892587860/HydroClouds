package com.hydro.client;

import java.io.*;
import java.net.*;

public class ClientTest {
	public static void main(String args[]) throws UnknownHostException,
			IOException {
		Socket socket = new Socket("127.0.0.1", 1200);
		PrintWriter writer = new PrintWriter(socket.getOutputStream());
		BufferedReader reader = new BufferedReader(new InputStreamReader(
				socket.getInputStream()));
		if (socket.isConnected()) {
			writer.println("7E7E08001234123403E832002402015F140402100002F1F1001234123447F0F014040210000E1A000015031101543812087303C1C3");
			writer.flush();
			System.out.println("客户端接受到服务器的:" + reader.readLine());
		}
		// 继续循环
		writer.close(); // 关闭Socket输出流
		reader.close(); // 关闭Socket输入流
		socket.close(); // 关闭Socket
	}
}