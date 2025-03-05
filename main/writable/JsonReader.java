package main.writable;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;

import main.model.House;
import main.model.ListHouse;

import java.io.FileReader;
import java.io.IOException;

public class JsonReader {
    private String filePath;

    public JsonReader() {
        this.filePath = "./data/houses.json";
    }

    public void readHouses() {
        ListHouse houses = new ListHouse();

        try (FileReader reader = new FileReader(filePath)) {
            JSONTokener tokener = new JSONTokener(reader);
            JSONArray jsonArray = new JSONArray(tokener);

            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonObject = jsonArray.getJSONObject(i);
                House house = new House(
                        jsonObject.getString("photo_url"),
                        jsonObject.getString("title"),
                        jsonObject.getString("bathrooms"),
                        jsonObject.getString("price"),
                        jsonObject.getString("facebookUrl")
                );
                houses.addHouse(house);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}

