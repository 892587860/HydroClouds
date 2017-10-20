package com.hydro.client;

public class BinHexConvert {
	public static void main(String[] args)  
    {  
        String hexString = "ABC";  
        System.out.println(hexString2binaryString(hexString));  
    }  
  
    public static String hexString2binaryString(String hexString)  
    {  
        if (hexString == null )  
            return null;  
        String bString = "", tmp;  
        for (int i = 0; i < hexString.length(); i++)  
        {  
            tmp = "" + Integer.toBinaryString(Integer.parseInt(hexString  
                            .substring(i, i + 1), 16));  
            bString += tmp;  
        }  
        return bString;  
    }  
}
