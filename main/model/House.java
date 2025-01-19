package main.model;

public class House {
    private String photo_url;
    private String title;
    private String listingUrl;
    private String amount;
    private String facebookUrl;

    public House(String photo_url, String title, String listingUrl, String amount, String facebookUrl) {
        this.photo_url = photo_url;
        this.title = title;
        this.listingUrl = listingUrl;
        this.amount = amount;
        this.facebookUrl = facebookUrl;
    }

    // Getters and Setters

    public String getPhoto_url() {
        return photo_url;
    }

    public void setPhoto_url(String photo_url) {
        this.photo_url = photo_url;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getListingUrl() {
        return listingUrl;
    }

    public void setListingUrl(String listingUrl) {
        this.listingUrl = listingUrl;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getFacebookUrl() {
        return facebookUrl;
    }

    public void setFacebookUrl(String facebookUrl) {
        this.facebookUrl = facebookUrl;
    }


}
