#### 使用Lookup关联查询并使用关联表字段 `$addFields`
::: details 点击查看代码
``` csharp
  var query2 = headColl.Aggregate()
      .Lookup<VisitRecordHead, VisitRecordRelation, VisitRecordAggregate>(relationColl, l => l.BusinessId, r => r.BusinessId, @as: x => x.RelationAggregate)
      .Match(x => !x.IsScrap)
      .MatchIf(filter != null, filter)
      .MatchIf(!string.IsNullOrEmpty(param.BusinessTypeId), x => x.RelationAggregate.BusinessTypeId == param.BusinessTypeId)
      .MatchIf(!string.IsNullOrEmpty(param.BusinessTbName), x => x.RelationAggregate.BusinessTbName == param.BusinessTbName)
      .MatchIf(!string.IsNullOrEmpty(param.BusinessId), x => x.BusinessId == param.BusinessId)
      .MatchIf(!string.IsNullOrEmpty(param.KeyWords), x => x.VisitContent.Contains(param.KeyWords))
      .AppendStage<VisitRecordAggregate>("{$addFields:{Relation:{$arrayElemAt: [\"$RelationAggregate\",0]}}}")
      .Project(p => new
      {
          p.Relation.BusinessTbName
      })
      .Sort(new BsonDocument { { "VisitDate", -1 } });
    var data3 = await query2.Skip((param.page - 1) * param.limit).Limit(param.limit).ToListAsync();
```
::: 
#### 使用Lookup,pipeline 在关联表中增加查询条件`$match`、`$project`等
::: details 点击查看代码
``` csharp
    var headCollect = _dbHelper.GetCollection<CmsHead>(_tableName);
    var recordCollect = _dbHelper.GetCollection<CmsReadRecords>(_readerTableName);
    var bs = @"{$expr:{ $and:[{$eq:['$UserId',CSUUID('" + user.UserId.ToString() + "')]},{$eq:['$HeadId','$$topId']}]}}";
    var pipeline = PipelineDefinition<CmsReadRecords, CmsReadRecords>.Create(new[] {
        PipelineStageDefinitionBuilder.Match<CmsReadRecords>(bs)
    });
    var let = new Dictionary<string, string>() { { "topId", "$_id" } };
    var sort = new Dictionary<string, object>() { { "ReadNum", 1 } };
    var query = headCollect.Aggregate()
        .Lookup<CmsHead, CmsReadRecords, CmsReadRecords, List<CmsReadRecords>, CmsHeadDto>(foreignCollection: recordCollect,
            let: let.ToBsonDocument(),
            lookupPipeline: pipeline,
            @as: x => x.ReadRecords)
```
::: 
> 重点：pipeline 构建使用 `PipelineStageDefinitionBuilder`；let 是定义后续查询使用字段并对应主表字段值，后续查询中不能直接使用主表字段

#### pipeline 管道复杂查询
::: details 点击查看代码
``` csharp
 var pipeline = PipelineDefinition<CargoSendList, CargoBillGroup>.Create(new[] {
                BsonDocument.Parse("{$match:{hzpm:'',dzhzzm:'',fzhzzm:''}}"),//查询条件
                BsonDocument.Parse("{$group:{_id:'$ysfs',lastDate:{$max:'$slrq'}}}"),//分组
                BsonDocument.Parse(@"{$lookup:{from:'youer-collection-name',let:{type:'$_id',lastDate:'$lastDate'},pipeline:[{$match:{$expr:{$and:[{$eq:['$ysfs','$$type']},{$eq:['$slrq','$$lastDate']}]}}},{$limit:1}],as:'data'}}"),
                BsonDocument.Parse("{$unwind:'$data'}"),
                BsonDocument.Parse("{$project:{_id:'$_id',lastDate:'$lastDate',data:'$data'}}")
            });
```
::: 