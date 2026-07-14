package com.gestionflotte.backend.entity;


import java.time.LocalDate;

public class VehicleDataRequest {

    private Long vehiculeId;
    private String vehicleModel;
    private Integer mileage;
    private String maintenanceHistory;
    private Integer reportedIssues;
    private Integer vehicleAge;
    private String fuelType;
    private String transmissionType;
    private Double engineSize;
    private Integer odometerReading;
    private Integer lastServiceMileage;
    private LocalDate lastServiceDate;
    private LocalDate warrantyExpiryDate;
    private String ownerType;
    private Double insurancePremium;
    private Integer serviceHistory;
    private String accidentHistory;
    private Double fuelEfficiency;
    private String tireCondition;
    private String brakeCondition;
    private String batteryStatus;

    public Long getVehiculeId() {
        return vehiculeId;
    }

    public void setVehiculeId(Long vehiculeId) {
        this.vehiculeId = vehiculeId;
    }

    public String getVehicleModel() {
        return vehicleModel;
    }

    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
    }

    public Integer getMileage() {
        return mileage;
    }

    public void setMileage(Integer mileage) {
        this.mileage = mileage;
    }

    public String getMaintenanceHistory() {
        return maintenanceHistory;
    }

    public void setMaintenanceHistory(String maintenanceHistory) {
        this.maintenanceHistory = maintenanceHistory;
    }

    public Integer getReportedIssues() {
        return reportedIssues;
    }

    public void setReportedIssues(Integer reportedIssues) {
        this.reportedIssues = reportedIssues;
    }

    public Integer getVehicleAge() {
        return vehicleAge;
    }

    public void setVehicleAge(Integer vehicleAge) {
        this.vehicleAge = vehicleAge;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public String getTransmissionType() {
        return transmissionType;
    }

    public void setTransmissionType(String transmissionType) {
        this.transmissionType = transmissionType;
    }

    public Double getEngineSize() {
        return engineSize;
    }

    public void setEngineSize(Double engineSize) {
        this.engineSize = engineSize;
    }

    public Integer getOdometerReading() {
        return odometerReading;
    }

    public void setOdometerReading(Integer odometerReading) {
        this.odometerReading = odometerReading;
    }

    public Integer getLastServiceMileage() {
        return lastServiceMileage;
    }

    public void setLastServiceMileage(Integer lastServiceMileage) {
        this.lastServiceMileage = lastServiceMileage;
    }

    public LocalDate getLastServiceDate() {
        return lastServiceDate;
    }

    public void setLastServiceDate(LocalDate lastServiceDate) {
        this.lastServiceDate = lastServiceDate;
    }

    public LocalDate getWarrantyExpiryDate() {
        return warrantyExpiryDate;
    }

    public void setWarrantyExpiryDate(LocalDate warrantyExpiryDate) {
        this.warrantyExpiryDate = warrantyExpiryDate;
    }

    public String getOwnerType() {
        return ownerType;
    }

    public void setOwnerType(String ownerType) {
        this.ownerType = ownerType;
    }

    public Double getInsurancePremium() {
        return insurancePremium;
    }

    public void setInsurancePremium(Double insurancePremium) {
        this.insurancePremium = insurancePremium;
    }

    public Integer getServiceHistory() {
        return serviceHistory;
    }

    public void setServiceHistory(Integer serviceHistory) {
        this.serviceHistory = serviceHistory;
    }

    public String getAccidentHistory() {
        return accidentHistory;
    }

    public void setAccidentHistory(String accidentHistory) {
        this.accidentHistory = accidentHistory;
    }

    public Double getFuelEfficiency() {
        return fuelEfficiency;
    }

    public void setFuelEfficiency(Double fuelEfficiency) {
        this.fuelEfficiency = fuelEfficiency;
    }

    public String getTireCondition() {
        return tireCondition;
    }

    public void setTireCondition(String tireCondition) {
        this.tireCondition = tireCondition;
    }

    public String getBrakeCondition() {
        return brakeCondition;
    }

    public void setBrakeCondition(String brakeCondition) {
        this.brakeCondition = brakeCondition;
    }

    public String getBatteryStatus() {
        return batteryStatus;
    }

    public void setBatteryStatus(String batteryStatus) {
        this.batteryStatus = batteryStatus;
    }
}
