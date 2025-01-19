package main.model;

import java.util.ArrayList;
import java.util.List;

public class ListHouse {
    private List<House> houses;

    public ListHouse() {
        houses = new ArrayList<>();
    }

    public List<House> getHouses() {
        return houses;
    }

    public void addHouse(House house) {
        houses.add(house);
    }

    public void removeHouse(House house) {
        houses.remove(house);
    }

}
