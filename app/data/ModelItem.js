class ModelItem {

  get(valueName) {
    return this[valueName];
  }

  constructor(data) {
    this.Id = data.Id;
    this.Subject = data.Subject;
    this.MasterWorksheet = data.MasterWorksheet;
    this.Dependency = [
      data.DependentOnWorksheetId2,
      data.DependentOnWorksheetId,
    ];
    this.Status = data.Status;
    this.lvl = NaN;
  }

}

export default ModelItem;
