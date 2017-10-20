package com.hydro.server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.Socket;

public class ServerThread extends Thread {

	public static final String CHARCODE = "utf-8";
	
	private Socket socket;

	public ServerThread(Socket socket) {
		this.socket = socket;
	}

	private PrintWriter getWriter(Socket socket) throws IOException {
		OutputStream outputStream = socket.getOutputStream();
		return new PrintWriter(new OutputStreamWriter(outputStream, CHARCODE), true);
	}

	private BufferedReader getReader(Socket socket) throws IOException {
		InputStream inputStream = socket.getInputStream();
		return new BufferedReader(new InputStreamReader(inputStream, CHARCODE));
	}

	@Override
	public void run() {
		BufferedReader reader = null;
        PrintWriter writer = null;
		try {

			reader = getReader(socket);

			writer = getWriter(socket);

			String strFroClient = reader.readLine();

			System.out.println("客户端发来：" + strFroClient);

			writer.println("收到！");

		} catch (IOException e) {

			e.printStackTrace();
		}finally {
            try {
                if (socket != null){
                	socket.close();
                }
                if (reader != null){
                	reader.close();
                }
                if (writer != null){
                	writer.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

	}

}
