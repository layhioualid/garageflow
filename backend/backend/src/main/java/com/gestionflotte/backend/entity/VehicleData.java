package com.gestionflotte.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "vehicle_data")
public class VehicleData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicule_id")
    private Long vehiculeId;

    @Column(name = "vehicle_model")
    private String vehicleModel;

    private Integer mileage;

    @Column(name = "maintenance_history")
    private String maintenanceHistory;

    @Column(name = "reported_issues")
    private Integer reportedIssues;

    @Column(name = "vehicle_age")
    private Integer vehicleAge;

    @Column(name = "fuel_type")
    private String fuelType;

    @Column(name = "transmission_type")
    private String transmissionType;

    @Column(name = "engine_size")
    private Double engineSize;

    @Column(name = "odometer_reading")
    private Integer odometerReading;

    @Column(name = "last_service_mileage")
    private Integer lastServiceMileage;

    @Column(name = "last_service_date")
    private LocalDate lastServiceDate;

    @Column(name = "warranty_expiry_date")
    private LocalDate warrantyExpiryDate;

    @Column(name = "owner_type")
    private String ownerType;

    @Column(name = "insurance_premium")
    private Double insurancePremium;

    @Column(name = "service_history")
    private Integer serviceHistory;

    @Column(name = "accident_history")
    private String accidentHistory;

    @Column(name = "fuel_efficiency")
    private Double fuelEfficiency;

    @Column(name = "tire_condition")
    private String tireCondition;

    @Column(name = "brake_condition")
    private String brakeCondition;

    @Column(name = "battery_status")
    private String batteryStatus;

    @Column(name = "need_maintenance")
    private Integer needMaintenance;

    public Long getId() {
        return id;
    }

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

    public Integer getNeedMaintenance() {
        return needMaintenance;
    }

    public void setNeedMaintenance(Integer needMaintenance) {
        this.needMaintenance = needMaintenance;
    }
}